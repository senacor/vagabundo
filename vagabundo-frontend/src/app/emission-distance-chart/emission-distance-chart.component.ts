import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation,
  HostListener } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Format from 'd3-format';
import { Stats } from '@api/models';

/**
 * Data structure to visualize the information within the graphic.
 */
class EmissionDistanceData {
  /** Name of the transport type (train, plane, taxi, ...). */
  name: string;
  /** CO2 emission in kg. */
  emission: number;
  /** Distance travelled in km. */
  distance: number;
  /** a unicode encoded string for the FontAwesome icon. */
  iconType: string;
}

@Component({
  selector: 'app-emission-distance-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './emission-distance-chart.component.html',
  styleUrls: ['./emission-distance-chart.component.scss']
})
export class EmissionDistanceChartComponent implements OnInit, OnChanges {
  constructor(myElement: ElementRef) {
    this.nativeEl = myElement.nativeElement;
    this.componentSelection = d3Selection.select(this.nativeEl);
  }

  @Input() stats: Stats;
  @Input() width: number;
  @Input() height: number;
  @Input() xAxisLabel = 'Distanz (km)';
  @Input() yAxisLabel = 'Emission pro Distanz (g/km)';

  @Input() transitionDuration = 1000;

  private readonly nativeEl: any;
  private data: EmissionDistanceData[];
  private margin = { top: 20, right: 85, bottom: 50, left: 70 };
  /** Component element selection. */
  private componentSelection: d3Selection.Selection<any, {}, any, any>;
  /** SVG node. Inside this element everything is drawn. */
  private svg: d3Selection.Selection<SVGElement, {}, HTMLElement, any>;
  private x: d3.ScaleLinear<number, number>;
  private y: d3.ScaleLinear<number, number>;
  /** The chart is loaded and at least one dataset is inside. */
  public showChart = false;
  /** We loaded data, but there simply is not data to display. Show error message instead. */
  public showNoData = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.stats !== undefined && changes.stats.currentValue !== undefined &&
      changes.stats.currentValue !== null) {
      this.data = this.convertData(changes.stats.currentValue);
      this.init();
      this.draw();
    }
  }

  ngOnInit(): void {
    if (this.stats === undefined) {
      throw new Error('Attribute stats is required.');
    }
  }

  /**
   * Converts the data from Stats to an array of information to display.
   * @param statistics statistics object from backend
   */
  private convertData(statistics: Stats): EmissionDistanceData[] {
    if (statistics === null) {
      return [];
    }

    const data = [];

    /**
     * Checks whether the statistics object for the given transport type is valid (i.e. exists and distances and
     * emission are greater than zero).
     * @param type transport type
     */
    const isValidStatisticsType = function(type: string): boolean {
      const datum = statistics[type];
      return datum !== undefined && datum.emission !== undefined &&
        datum.emission.co2e !== undefined && datum.distance &&
        datum.emission.co2e > 0 && datum.distance > 0;
    };

    /**
     * Adds the statistics type to the converted format iff it is valid.
     * @param type transport type
     * @param icon unicode sign for the icon
     */
    const addStatistic = function(type: string, icon: string): void {
      if (isValidStatisticsType(type)) {
        data.push({
          name: type,
          emission: statistics[type].emission.co2e,
          distance: statistics[type].distance,
          iconType: icon
        });
      }
    };

    addStatistic('plane', '\uf072');
    addStatistic('train', '\uf238');
    addStatistic('taxi', '\uf1ba');

    return data;
  }

  /**
   * Calculates the emission per distance as g/km.
   * Returns 0 if the distance is zero.
   * @param val emission distance data
   */
  private calculateEmissionPerDistance(val: EmissionDistanceData): number {
    return val.distance === 0 ? 0 : 1000 * val.emission / val.distance;
  }

  /**
   * Initializes basic layout and data binding. Sets up the SVG element and the layout groups.
   */
  private init(): void {
    this.setSizeBasedOnOuterElement();
    this.svg = this.componentSelection.select('svg');

    const defs = this.svg.append('defs');
    this.data.forEach(d => this.appendGradient(defs, d.name));

    this.svg.append('g').attr('class', 'boxes');
    this.svg.append('g').attr('class', 'box-icons')
      .attr('text-anchor', 'start');
    this.svg.append('g').attr('class', 'box-labels')
      .attr('text-anchor', 'start');
    this.svg.append('g').attr('class', 'x-axis');
    this.svg.append('text').attr('class', 'x-axis-label');
    this.svg.append('g').attr('class', 'y-axis');
    this.svg.append('text').attr('class', 'y-axis-label');
  }

  /**
   * Draws the graph.
   */
  private draw(): void {
    this.initScales();
    this.drawBoxes();
    this.drawXAxis();
    this.drawYAxis();
  }

  /**
   * Appends a vertical linear gradient definition to the SVG. The colors itself can be defined via CSS.
   * @param defs definition SVG element
   * @param name name of the classes and the gradient id
   */
  private appendGradient(defs: any, name: string): any {
    const gradient = defs.append('linearGradient')
      .attr('id', name + 'Gradient')
      .attr('gradientTransform', 'rotate(90)');
    gradient.append('stop')
      .attr('class', name + ' gradient-top')
      .attr('offset', '0.3');
    gradient.append('stop')
      .attr('class', name + ' gradient-bottom')
      .attr('offset', '1');
    return defs;
  }

  /**
   * Initializes the x and y scales.
   * The x scale should map the distance from 0 to maximum distance to the whole x axis from left to right.
   * The y scale should map the emission from 0 to maximum emission on the whole y axis from bottom to top.
   */
  private initScales(): void {
    this.x = d3Scale.scaleLinear()
      .domain([0, d3.max(this.data, d => d.distance)])
      .range([this.margin.left, this.width - this.margin.right]);

    this.y = d3Scale.scaleLinear()
      .domain([0, d3.max(this.data, d => this.calculateEmissionPerDistance(d))])
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.svg.attr('height', Math.max(this.height, 230));
  }

  /**
   * Draws the actual boxes displaying the data visualization.
   * Inserts, updates and removes the svg elements corresponding to the data.
   */
  private drawBoxes(): void {
    const dataSelection = this.svg.select('.boxes')
      .selectAll('rect.box')
      .data(this.data, d => (<EmissionDistanceData> d).name);

    // remove all boxes which are not in the data set anymore
    dataSelection.exit().remove();

    // insert for all new data sets a new rectangle (box)
    const enter: d3Selection.Selection<d3Selection.BaseType, EmissionDistanceData, d3Selection.BaseType, {}>
      = dataSelection.enter().append('rect')
      .attr('class', d => 'box ' + d.name);

    // merge the selection for all new boxes with all existing ones which have to be updated
    // as all our box values (x could be changed because the graph dimensions changed (window resize);
    // y, width and height can be changed because they depend on the emission andf distance value)
    const allNodes = enter.merge(dataSelection);
    allNodes.attr('x', this.x(0))
      .attr('y', d => this.height - this.y(this.calculateEmissionPerDistance(d)))
      .transition().duration(this.transitionDuration)
      .attr('x', this.x(0))
      .attr('y', d => this.y(this.calculateEmissionPerDistance(d)))
      .attr('width', d => this.x(d.distance) - this.x(0))
      .attr('height', d => this.height - this.margin.bottom - this.y(this.calculateEmissionPerDistance(d)));

    this.drawBoxIcons();
    this.drawBoxLabels();
    this.setVisibility(allNodes.nodes());
  }

  /**
   * Draws the icons next to the boxes as label. The icon will be on the upper right next to the box and will
   * represent the transport type.
   */
  private drawBoxIcons(): void {
    const dataSelection = this.svg.select('.box-icons')
      .selectAll('image')
      .data(this.data, d => (<EmissionDistanceData> d).name);

    // remove all boxes which are not in the data set anymore
    dataSelection.exit().remove();

    // insert for all new data sets a new text element
    const enter: d3Selection.Selection<d3Selection.BaseType, EmissionDistanceData, d3Selection.BaseType, {}>
      = dataSelection.enter().append('image')
      .attr('height', '20')
      .attr('width', '40')
      .attr('xlink:href', d => 'assets/img/' + d.name + '.png');

    // merge the selection for all new icons with all existing icons which have to be updated
    enter.merge(dataSelection)
      .transition().duration(this.transitionDuration)
      .attr('x', d => this.x(d.distance) + 5)
      .attr('y', d => d3.min([this.y(this.calculateEmissionPerDistance(d)),
        this.height - this.margin.bottom - 22]));
  }
  /**
   * Draws the text labels for the boxes as data visualization. The text labels will contain the emission data
   * as text and will appear right next to the upper right of the box just below the icon.
   */
  private drawBoxLabels(): void {
    const dataSelection = this.svg.select('.box-labels')
      .selectAll('text')
      .data(this.data, d => (<EmissionDistanceData> d).name);

    // remove all boxes which are not in the data set anymore
    dataSelection.exit().remove();

    // insert for all new data sets a new text element
    const enter: d3Selection.Selection<d3Selection.BaseType, EmissionDistanceData, d3Selection.BaseType, {}>
      = dataSelection.enter().append('text')
      .attr('class', 'box-label');

    // merge the selection for all new labels with all existing labels which have to be updated
    enter.merge(dataSelection)
      .transition().duration(this.transitionDuration)
      .attr('x', d => this.x(d.distance) + 5)
      .attr('y', d => d3.min([this.y(this.calculateEmissionPerDistance(d)) + 33,
        this.height - this.margin.bottom - 4]))
      .text(d => d.emission.toLocaleString('de-DE',
        {minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false}) + 'kg');
  }

  /**
   * Draws the x axis and the corresponding labels. At each label there is a little tick to indicate where the
   * value is located in the graphic.
   * The x axis represents the distance travelled. The labels are the distances in kilometers.
   */
  private drawXAxis(): void {
    this.svg.select('.x-axis')
      .attr('transform', 'translate(0, ' + (this.height - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.x).tickSizeOuter(0).tickFormat(d3Format.format('.0f')));

    // text label for the x axis
    this.svg.select('.x-axis-label')
      .attr('class', 'x-axis-label axis-label')
      .attr('transform',
        'translate(' + (this.width / 2) + ' ,' + (this.height - this.margin.top + 20) + ')')
      .style('text-anchor', 'middle')
      .text(this.xAxisLabel);
  }

  /**
   * Draws the y axis and the corresponding labels. At each label there is a little tick to indicate where the
   * value is located within the graphic.
   * The y axis represents the CO2 emission. The labels are the CO2 emissions in kg.
   */
  private drawYAxis(): void {
    this.svg.select('.y-axis')
      .attr('transform', 'translate(' + this.margin.left + ', 0)')
      .call(d3.axisLeft(this.y).tickSizeOuter(0).tickFormat(d3Format.format('.0f')));

    // text label for the y axis
    this.svg.select('.y-axis-label')
      .attr('class', 'y-axis-label axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .text(this.yAxisLabel);
  }

  private setSizeBasedOnOuterElement(): void {
    this.width = this.nativeEl.children[0].offsetWidth;
    this.height = this.width * 3 / 9;
  }

  /**
   * Sets the visibility of the chart and error messages based on whether there is actually data to show.
   * @param dataToDisplay data nodes
   */
  private setVisibility(dataToDisplay: any[]): void {
    if (dataToDisplay.length === 0) {
      this.showNoData = true;
      this.showChart = false;
    } else {
      this.showNoData = false;
      this.showChart = true;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.setSizeBasedOnOuterElement();
    this.draw();
  }
}
